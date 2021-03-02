from flask import Flask, render_template, request, json, jsonify
from bson import json_util,objectid
import db
from emotion_recognition import predict_emotion
import datetime
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_bcrypt import Bcrypt
from flask_cors import CORS
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins=None)
bcrypt = Bcrypt(app)
CORS(app)

def JsonEncoder(mongoArray):
    for obj in mongoArray:
        for key in obj:
            if type(obj[key])==objectid.ObjectId:
                obj[key] = json_util.dumps(obj[key])[10:-2]
    return mongoArray

def JsonEncodeOne(mongoObj):
    for key in mongoObj:
            if type(mongoObj[key])==objectid.ObjectId:
                mongoObj[key] = json_util.dumps(mongoObj[key])[10:-2]
    return mongoObj

@app.route('/',methods=['POST'])
def sign_in():
    user = json.loads(request.data)
    existent_user = db.db.usuario_collection.find_one({"email":user["email"]})
    existent_user = JsonEncodeOne(existent_user)
    if not existent_user:
        return {"loggedIn":False,"message": "El correo no existe. Por favor, intente con otro correo.","classStyle":"alert alert-danger"}
    else:
        if bcrypt.check_password_hash(existent_user["password"], user["password"]) :
            return {"loggedIn":True, "user":existent_user}
        else:
            return {"loggedIn":False,"message": "Contraseña incorrecta.","classStyle":"alert alert-danger"}

@app.route('/sign-up',methods=["POST"])
def sign_up():
    new_user = json.loads(request.data)
    if db.db.usuario_collection.find_one({"email":new_user["email"]}):
        if "token" in new_user:
            db.db.usuario_collection.update_one({"email":new_user["email"]},{"$set":{"token":new_user["token"]}})
            new_user = db.db.usuario_collection.find_one({"email":new_user["email"]})
            new_user =  JsonEncodeOne(new_user)
            return {"loggedIn":True, "user":new_user}
        else:
            return {"message": "Ya existe una cuenta con el correo que has usado. Por favor, intente con otro correo.","classStyle":"alert alert-danger"}
    else:
        db.db.usuario_collection.insert_one(new_user)
        if "token" in new_user:
            new_user = db.db.usuario_collection.find_one({"email":new_user["email"]})
            new_user =  JsonEncodeOne(new_user)
            return {"loggedIn":True, "user":new_user}
        return {"message": "¡Te has registrado con éxito! ","classStyle":"alert alert-success"}

@app.route('/photo',methods=["POST"])
def photo():
    data = json.loads(request.data)
    userId = objectid.ObjectId(data["userId"])
    image_from_web = data["photo"]
    if(image_from_web):
        feeling = predict_emotion(image_from_web)
        db.db.usuario_collection.update_one({"_id":userId},{"$set":{"feeling":feeling}})
        user = db.db.usuario_collection.find_one({"_id":userId})
        user = JsonEncodeOne(user)
        return {"loggedIn":True,"user":user}
    else:
        return None

@app.route('/diario/tareas/',methods=["POST"])
def add_task():
    new_task = json.loads(request.data)
    userId = objectid.ObjectId(new_task["userId"])
    new_task["userId"] = userId
    db.db.diario_collection.insert_one(new_task)
    new_task = JsonEncodeOne(new_task)
    return {"task":new_task}

@app.route('/diario/tareas/<userId>/<date>',methods=['GET'])
def get_tasks(userId,date):
    userId = objectid.ObjectId(userId)
    tasks = [task for task in db.db.diario_collection.find({"userId":userId,"date":date})]                                                                                                                                
    tasks = JsonEncoder(tasks)
    return {"tasks":tasks}

@app.route('/diario/tareas/<userId>/<_id>',methods=['DELETE'])
def delete_task(userId,_id):
    userId = objectid.ObjectId(userId)
    _id = objectid.ObjectId(_id)
    db.db.diario_collection.delete_one({"userId":userId,"_id":_id})
    return {"task":{}}

@app.route('/diario/tareas/<userId>/<_id>',methods=['PUT'])
def update_task(userId,_id):
    userId = objectid.ObjectId(userId)
    _id = objectid.ObjectId(_id)
    prevTask = db.db.diario_collection.find_one({"userId":userId,"_id":_id})
    state = not prevTask['done']
    db.db.diario_collection.update_one({"userId":userId,"_id":_id},{"$set":{"done":state}})
    newTask = db.db.diario_collection.find_one({"userId":userId,"_id":_id})
    newTask = JsonEncodeOne(newTask)
    return {"task":newTask}
    
@app.route('/inicio/posts/',methods=["POST"])
def add_post():
    new_post = json.loads(request.data)
    userId = objectid.ObjectId(new_post["userId"])
    new_post["userId"] = userId
    db.db.post_collection.insert_one(new_post)
    new_post = JsonEncodeOne(new_post)
    return {"post":new_post}

@app.route('/inicio/posts/<userId>/',methods=['GET'])
def get_posts(userId):
    userId = objectid.ObjectId(userId)
    obj_ids =[]
    obj_ids.append(userId)
    for friend in db.db.usuario_collection.find({"_id":userId},{"friends.id":1,"_id":0,"friends.status":1}):
        friends = friend
        for uId in friends['friends']:
            if uId['status'] == 'amigos':
                obj_ids.append(objectid.ObjectId(uId['id']))
    posts = [post for post in db.db.post_collection.find({"userId":{"$in":obj_ids}})]
    posts.reverse()                                                                                                                                
    posts = JsonEncoder(posts)
    return {"posts":posts}

@app.route('/inicio/posts/<userId>/<_id>',methods=['DELETE'])
def delete_post(userId,_id):
    userId = objectid.ObjectId(userId)
    _id = objectid.ObjectId(_id)
    db.db.post_collection.delete_one({"userId":userId,"_id":_id})
    for comment in db.db.comment_collection.find({"postId":_id}):
        db.db.comment_collection.delete_one({"postId":_id,"_id":comment["_id"]})
    return {"post":{}}

@app.route('/inicio/posts/<postId>/likes',methods=['POST'])
def add_like(postId):
    friend = json.loads(request.data)
    db.db.post_collection.update({"_id":objectid.ObjectId(postId)},{"$addToSet":{"likes":friend}})
    countLikes = len(db.db.post_collection.find_one({"_id":objectid.ObjectId(postId)})["likes"])
    return {"countLikes":countLikes}

@app.route('/inicio/posts/<postId>/likes',methods=['GET'])
def get_likes(postId):
    peopleLiked = db.db.post_collection.find_one({"_id":objectid.ObjectId(postId)})["likes"]
    countLikes = len(peopleLiked)
    peopleLiked = JsonEncoder(peopleLiked)
    return {"countLikes":countLikes,"peopleLiked":peopleLiked}

@app.route('/inicio/posts/<postId>/likes/<userId>',methods=['DELETE'])
def delete_like(postId,userId):
    db.db.post_collection.update({"_id":objectid.ObjectId(postId)},{"$pull":{"likes":{"userId":userId}}})
    countLikes = len(db.db.post_collection.find_one({"_id":objectid.ObjectId(postId)})["likes"])
    peopleLiked = db.db.post_collection.find_one({"_id":objectid.ObjectId(postId)})["likes"]
    peopleLiked = JsonEncoder(peopleLiked)
    return {"countLikes":countLikes}

@app.route('/inicio/posts/<postId>/comments',methods=['POST'])
def add_comment(postId):
    comment = json.loads(request.data)
    userId = objectid.ObjectId(comment["userId"])
    comment["userId"] = userId
    postId = objectid.ObjectId(postId)
    comment["postId"] = postId
    db.db.comment_collection.insert_one(comment)
    countComments = len([comment for comment in db.db.comment_collection.find({"postId":postId})])
    comment = JsonEncodeOne(comment)
    return {"countComments":countComments,"comment":comment}

@app.route('/inicio/posts/<postId>/comments',methods=['GET'])
def get_comments(postId):
    postId = objectid.ObjectId(postId)
    comments = [comment for comment in db.db.comment_collection.find({"postId":postId})]
    countComments = len(comments)
    comments = JsonEncoder(comments)
    return {"countComments":countComments,"comments":comments}

@app.route('/inicio/posts/<postId>/comments/<commentId>',methods=['DELETE'])
def delete_comment(postId,commentId):
    postId = objectid.ObjectId(postId)
    commentId = objectid.ObjectId(commentId)
    db.db.comment_collection.delete_one({"postId":postId,"_id":commentId})
    countComments = len([comment for comment in db.db.comment_collection.find({"postId":postId})])
    return {"countComments":countComments}

@app.route('/perfil/<userId>',methods=['GET'])
def get_user(userId):
    userId = objectid.ObjectId(userId)
    user = db.db.usuario_collection.find_one({"_id":userId})
    completed_tasks_dates = [date for date in db.db.diario_collection.aggregate([{"$match":{"userId":userId}},{"$group":{"_id":"$date"}},{"$sort":{"_id":-1}}])]
    user = JsonEncodeOne(user)
    return {"user":user,"dates":completed_tasks_dates}

@app.route('/perfil/<userId>',methods=['POST'])
def update_user(userId):
    data = json.loads(request.data)
    userId = objectid.ObjectId(userId)
    if data["labor"] and data["imageUrl"]:
        db.db.usuario_collection.update_one({"_id":userId},{"$set":{"labor":data["labor"],"imageUrl":data["imageUrl"]}})
    elif not data["labor"]:
        db.db.usuario_collection.update_one({"_id":userId},{"$set":{"imageUrl":data["imageUrl"]}})
    elif not data["imageUrl"]:
        db.db.usuario_collection.update_one({"_id":userId},{"$set":{"labor":data["labor"]}})
    user = db.db.usuario_collection.find_one({"_id":userId})
    user = JsonEncodeOne(user)
    return {"loggedIn":True,"user":user}

@app.route('/personas',methods=['GET'])
def get_users():
    users = [user for user in db.db.usuario_collection.find()]
    users = JsonEncoder(users)
    return {"users":users}

@app.route('/users/<userId>', methods=['GET'])
def get_user_by_id(userId):
    userId = objectid.ObjectId(userId)
    user = db.db.usuario_collection.find_one({"_id":userId})
    user = JsonEncodeOne(user)
    return {"user":user}

@app.route('/users/<userId>/friends/',methods=['GET'])
def get_friends_by_user(userId):
    mystrId = userId
    userId = objectid.ObjectId(userId)
    obj_ids =[]
    for friend in db.db.usuario_collection.find({"_id":userId},{"friends.id":1,"_id":0,"friends.status":1}):
        friends = friend
        for uId in friends['friends']:
            if uId['status'] == 'amigos':
                obj_ids.append(objectid.ObjectId(uId['id']))

    rooms=[]
    myUser = get_user_by_id(userId)
    

    users=[]
    for user in db.db.usuario_collection.find({"_id":{"$in":obj_ids}}):
        for friend in user['friends']:
            if friend['id'] == mystrId:
                user['room']=friend['room']
        users.append(user)

    users = JsonEncoder(users)
    return {"users":users}

@socketio.on('users')
def handle_users(users):
    print("USEEEEEERS")
    emit('usersResponse',users,broadcast=True)

@app.route('/messages/<roomId>/',methods=['GET'])
def get_messages(roomId):
    messages = [message for message in db.db.message_collection.find({"roomId":roomId})]
    messages = JsonEncoder(messages)
    return {"messages":messages}
# ENVIAR MENSAJE
@socketio.on('send_message')
def handle_send_message_event(data):
    #app.logger.info("{} has sent message to the room {}: {}".format(data['userId'], data['roomId'],data['message']))
    #save_message(data['room'], data['message'], data['userId'])
    print(data)
    print("MENSAJE_SOCKET")
    db.db.message_collection.insert_one({'roomId': data['roomId'], 'message': data['message'], 'sender': data['sender'], "receiver": data['receiver'] , 'createdAt': data['createdAt']})
    message = JsonEncodeOne(db.db.message_collection.find_one({'roomId': data['roomId'],'createdAt': data['createdAt']}))
    print(message)
    emit('receive_message', message, room=message['roomId'])

#UNIR LA SALA
@socketio.on('join_room')
def handle_join_room_event(data):
    #app.logger.info("{} has joined the room {}".format(data['userId'], data['roomId']))
    print("UNIDO A LA SALA")
    join_room(data['roomId'])
    #socketio.emit('join_room_announcement', data, room=data['roomId'])

#DEJAR LA SALA
@socketio.on('leave_room')
def handle_leave_room_event(data):
    app.logger.info("{} has left the room {}".format(data['userId'], data['roomId']))
    leave_room()
    #socketio.emit('leave_room_announcement', data, room=data['roomId'])

@socketio.on('keep_alive')
def keep_alive():
   print("-"*25)
   print("KEEPING ALIVE") 
   print("-"*25)

@app.route('/users/<userId>/friends/',methods=['POST'])
def add_friend(userId):
    friend = json.loads(request.data)
    if friend["status"] == "pendiente":
        friend_request = {"id":userId,"status":"por confirmar"}
        db.db.usuario_collection.update({"_id":objectid.ObjectId(userId)},{"$addToSet":{"friends":friend}})
        db.db.usuario_collection.update({"_id":objectid.ObjectId(friend["id"])},{"$addToSet":{"friends":friend_request}})
    elif friend["status"] == "amigos":
        db.db.room_collection.insert_one({"users":[userId, friend["id"]], "name":userId+friend["id"]})
        room = db.db.room_collection.find_one({"name":userId+friend["id"]})
        roomId = str(room["_id"])
        db.db.usuario_collection.update_one({"_id":objectid.ObjectId(userId),"friends.id":friend["id"]},{"$set":{"friends.$.status":friend["status"]}})
        db.db.usuario_collection.update_one({"_id":objectid.ObjectId(userId),"friends.id":friend["id"]},{"$set":{"friends.$.room" : roomId}}, upsert = True)
        db.db.usuario_collection.update_one({"_id":objectid.ObjectId(friend["id"]),"friends.id":userId},{"$set":{"friends.$.status":friend["status"]}})
        db.db.usuario_collection.update_one({"_id":objectid.ObjectId(friend["id"]),"friends.id":userId},{"$set":{"friends.$.room" : roomId}}, upsert = True)
    user = JsonEncodeOne(db.db.usuario_collection.find_one({"_id":objectid.ObjectId(userId)}))
    return {"loggedIn":True,"user":user}

@app.route('/users/<userId>/friends/<friendId>/',methods=['DELETE'])
def delete_friend(userId,friendId):
    db.db.usuario_collection.update({"_id":objectid.ObjectId(userId)},{"$pull":{"friends":{"id":friendId}}})
    db.db.usuario_collection.update({"_id":objectid.ObjectId(friendId)},{"$pull":{"friends":{"id":userId}}})
    user = JsonEncodeOne(db.db.usuario_collection.find_one({"_id":objectid.ObjectId(userId)}))
    return {"loggedIn":True,"user":user}