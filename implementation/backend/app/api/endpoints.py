from fastapi import APIRouter
from app.core.machine import machine
from app.core.database import get_history_collection
from motor.motor_asyncio import AsyncIOMotorCursor

router = APIRouter()

@router.get("/status")
async def get_system_status():
    """Poll the machine state and get history."""
    current_state = await machine.step()
    
    # Fetch last 20 records
    collection = get_history_collection()
    cursor: AsyncIOMotorCursor = collection.find().sort("timestamp", -1).limit(20)
    history = await cursor.to_list(length=20)
    
    # Process history for JSON serializability (remove _id)
    for h in history:
        if "_id" in h:
            h["_id"] = str(h["_id"])
            
    if "_id" in current_state:
        current_state["_id"] = str(current_state["_id"])

    return {
        "current": current_state,
        "history": history,
        "metadata": {
            "machine_id": "GXNU-GH-001",
            "phenomena_observed": ["readingMoisture", "readingTemp"],
            "phenomena_controlled": ["turnOnPump", "turnOffPump", "turnOnFan", "turnOffFan"]
        }
    }

@router.post("/manual/pump/{state}")
async def control_pump(state: bool):
    """Manual override (Boundary phenomena)."""
    machine.pump_on = state
    return {"status": "success", "pump": state}
