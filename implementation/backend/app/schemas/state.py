from pydantic import BaseModel
from typing import List, Dict, Any

class StateRecord(BaseModel):
    timestamp: str
    moisture: float
    temperature: float
    pump_active: bool
    fan_active: bool

class SystemStatus(BaseModel):
    current: StateRecord
    history: List[StateRecord]
    metadata: Dict[str, Any]
