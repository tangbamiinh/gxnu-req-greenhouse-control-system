import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app

@pytest.mark.asyncio
async def test_get_status():
    """Test the /status endpoint returns valid structure."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Mocking both the machine step and the DB history fetch
        with patch('app.api.endpoints.machine.step') as mock_step, \
             patch('app.api.endpoints.get_history_collection') as mock_db:
            
            mock_step.return_value = {
                "timestamp": "2026-01-04T12:00:00",
                "display_time": "12:00:00",
                "moisture": 50.0,
                "temperature": 25.0,
                "pump_active": False,
                "fan_active": False
            }
            
            # Mocking history fetch
            mock_cursor = AsyncMock()
            mock_cursor.to_list.return_value = []
            mock_db.return_value.find.return_value.sort.return_value.limit.return_value = mock_cursor
            
            response = await ac.get("/status")
            
    assert response.status_code == 200
    data = response.json()
    assert "current" in data
    assert "history" in data
    assert data["current"]["moisture"] == 50.0

@pytest.mark.asyncio
async def test_manual_override_pump():
    """Test that manual override updates machine state."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        from app.core.machine import machine
        
        # Override to True
        response = await ac.post("/manual/pump/true")
        assert response.status_code == 200
        assert machine.pump_on is True
        
        # Override back to False
        response = await ac.post("/manual/pump/false")
        assert response.status_code == 200
        assert machine.pump_on is False
