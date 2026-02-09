import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Requirement: Hosted Backend API
# Get the Atlas Connection String from your .env file
# It should look like: mongodb+srv://<db_username>:<db_password>@cluster.mongodb.net/?retryWrites=true&w=majority
MONGO_URI = os.getenv("MONGO_URI")

# Initialize client with the recommended Server API version for Atlas
client = MongoClient(MONGO_URI, server_api=ServerApi('1'))

# Database Name
db = client.hrms_lite

# Collections
employees_col = db.employees
attendance_col = db.attendance
counters_col = db.counters

def test_connection():
    
    # Verify db connection
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"Connection failed: {e}")

def get_next_employee_id():
    """
    Incrementing sequence counter and returning a formatted ID (e.g., EMP-1001).
    This operation is atomic to prevent duplicate IDs .
    """
    # Requirement: Duplicate employee handling
    counter = counters_col.find_one_and_update(
        {"_id": "employee_id"},
        {"$inc": {"sequence_value": 1}},
        upsert=True,  
        return_document=True
    )
    
    # Starting sequence from 1000; we can start it from wherever we want. 
    seq = counter.get("sequence_value", 1000)
    return f"EMP-{seq}"

def init_db():

    # email is unique  
    employees_col.create_index("email", unique=True)
    
    # employee cannot have more thn one attendance logs for a single day
    attendance_col.create_index([("employee_id", 1), ("date", 1)], unique=True)