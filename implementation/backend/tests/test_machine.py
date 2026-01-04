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
