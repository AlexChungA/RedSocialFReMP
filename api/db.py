from flask import Flask
from flask_pymongo import pymongo

CONNECTION_STRING = "mongodb+srv://admin:dIH5rHKYkESeqyKr@redsocial.627dc.mongodb.net/redsocial?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database('redsocial')
usuario_collection = pymongo.collection.Collection(db, 'usuario_collection')
diario_collection = pymongo.collection.Collection(db,'diario_collection')
post_collection = pymongo.collection.Collection(db,'post_collection')
comment_collection = pymongo.collection.Collection(db,'comment_collection')