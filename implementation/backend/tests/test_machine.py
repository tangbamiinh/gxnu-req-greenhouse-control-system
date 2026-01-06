import pytest
from unittest.mock import AsyncMock, patch
from app.core.machine import GreenhouseMachine

@pytest.fixture
def machine():
    return GreenhouseMachine()

@pytest.mark.asyncio
async def test_machine_drift(machine):
    """Test that environmental variables drift when no actuators are on."""
    initial_moisture = machine.moisture
    initial_temp = machine.temperature
    
    # Mock database collection to avoid actual DB connection
    with patch('app.core.machine.get_history_collection') as mock_db:
        mock_db.return_value.insert_one = AsyncMock()
        await machine.step()
    
    # Check that drift occurred (usually decreases moisture, increases temp if ambient)
    assert machine.moisture != initial_moisture
    assert machine.temperature != initial_temp

@pytest.mark.asyncio
async def test_moisture_maintenance_logic(machine):
    """Test Requirement FR2: Pump triggers when moisture < 40%."""
    machine.moisture = 35.0
    machine.pump_on = False
    
    with patch('app.core.machine.get_history_collection') as mock_db:
        mock_db.return_value.insert_one = AsyncMock()
        await machine.step()
    
    assert machine.pump_on is True  # Machine should have turned on pump

@pytest.mark.asyncio
async def test_temperature_regulation_logic(machine):
    """Test Requirement FR4: Fan triggers when temp > 30C."""
    machine.temperature = 35.0
    machine.fan_on = False
    
    with patch('app.core.machine.get_history_collection') as mock_db:
        mock_db.return_value.insert_one = AsyncMock()
        await machine.step()
    
    assert machine.fan_on is True  # Machine should have turned on fan

@pytest.mark.asyncio
async def test_safety_timer_logic(machine):
    """Test Safety Requirement: Pump turns off after 900s."""
    from datetime import datetime, timedelta
    
    # 1. Start Pump
    machine.moisture = 35.0
    machine.pump_on = False
    
    with patch('app.core.machine.get_history_collection') as mock_db:
        mock_db.return_value.insert_one = AsyncMock()
        await machine.step()
        
    assert machine.pump_on is True
    assert machine.pump_start_time is not None
    
    # 2. Simulate 901 seconds passing
    # We patch datetime in the module where it's used
    future_time = machine.pump_start_time + timedelta(seconds=901)
    
    with patch('app.core.machine.datetime') as mock_datetime:
        mock_datetime.now.return_value = future_time
        mock_datetime.strftime = datetime.strftime
        
        with patch('app.core.machine.get_history_collection') as mock_db:
             mock_db.return_value.insert_one = AsyncMock()
             await machine.step()
             
    # 3. Assert Pump is forced off
    assert machine.pump_on is False
    assert machine.pump_start_time is None
