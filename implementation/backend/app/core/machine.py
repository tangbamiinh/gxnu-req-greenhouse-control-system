import random
import logging
from datetime import datetime
from typing import List, Dict, Any
from app.core.database import get_history_collection

logger = logging.getLogger("GreenhouseController")

class GreenhouseMachine:
    def __init__(self):
        # Environmental State (Given Domains)
        self.moisture = 45.0
        self.temperature = 26.0
        
        # Actuator State (Design Domains)
        self.pump_on = False
        self.fan_on = False

    async def step(self) -> Dict[str, Any]:
        """Simulate one software cycle (The Machine Logic)."""
        self._simulate_environmental_drift()
        
        # --- REQ-1: Moisture Maintenance ---
        if self.moisture < 40 and not self.pump_on:
            self.pump_on = True
            logger.info(f"[{datetime.now().strftime('%H:%M:%S')}] MACHINE COMMAND: turnOnPump")
        elif self.moisture > 62 and self.pump_on:
            self.pump_on = False
            logger.info(f"[{datetime.now().strftime('%H:%M:%S')}] MACHINE COMMAND: turnOffPump")

        # --- REQ-2: Temperature Regulation ---
        if self.temperature > 30 and not self.fan_on:
            self.fan_on = True
            logger.info(f"[{datetime.now().strftime('%H:%M:%S')}] MACHINE COMMAND: turnOnFan")
        elif self.temperature < 25 and self.fan_on:
            self.fan_on = False
            logger.info(f"[{datetime.now().strftime('%H:%M:%S')}] MACHINE COMMAND: turnOffFan")

        record = {
            "timestamp": datetime.now().isoformat(),
            "display_time": datetime.now().strftime("%H:%M:%S"),
            "moisture": round(self.moisture, 2),
            "temperature": round(self.temperature, 2),
            "pump_active": self.pump_on,
            "fan_active": self.fan_on
        }
        
        # Persistent storage
        collection = get_history_collection()
        await collection.insert_one(record)
            
        return record

    def _simulate_environmental_drift(self):
        # ... logic stays same
        if self.pump_on:
            self.moisture += random.uniform(0.8, 1.5)
        else:
            self.moisture -= random.uniform(0.1, 0.4)
            
        if self.fan_on:
            self.temperature -= random.uniform(0.4, 0.9)
        else:
            self.temperature += random.uniform(0.1, 0.5)
            
        self.moisture = max(0.0, min(100.0, self.moisture))
        self.temperature = max(10.0, min(50.0, self.temperature))

# Singleton instance
machine = GreenhouseMachine()
