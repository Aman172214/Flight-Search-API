import  { useState } from 'react';
import axios from 'axios';
import './FlightSearchAPI.css'

const FlightSearchAPI = ()=> {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flightPrices, setFlightPrices] = useState({});

  const sourceChangeHandler = (event) => {
    setSource(event.target.value);
  };

  const destinationChangeHandler = (event) => {
    setDestination(event.target.value);
  };

  const dateChangeHandler = (event) => {
    setDate(event.target.value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/US/USD/en-US/${source}-sky/${destination}-sky/${date}?apiKey=YOUR_API_KEY`
      );
      
      const prices = {};
      response.data.Quotes.forEach((quote) => {
        const carrierId = quote.OutboundLeg.CarrierIds[0];
        const carrier = response.data.Carriers.find((c) => c.CarrierId === carrierId);
        prices[carrier.Name] = quote.MinPrice;
      });

      setFlightPrices(prices);
    } catch (error) {
      console.error('Error fetching flight prices:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className='container'>
      <h1>Flight Search</h1>
      <form onSubmit={onSubmitHandler}>
        <div className='form-group'>
          <label htmlFor='source'>Source:</label>
          <input type="text" id='source' value={source} onChange={sourceChangeHandler} />
        </div>
        <div className='form-group'>
          <label htmlFor='destination'>Destination:</label>
          <input type="text" id='destination' value={destination} onChange={destinationChangeHandler} />
        </div>
        <div className='form-group'>
          <label htmlFor='date'>Date:</label>
          <input type="date" id='date' value={date} onChange={dateChangeHandler} />
        </div>
        <button type="submit" disabled={isLoading} className='sumbit-btn'>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {Object.keys(flightPrices).length > 0 && (
        <div className='flight-prices'>
          <h2>Flight Prices</h2>
          <ul>
            {Object.entries(flightPrices).map(([carrier, price]) => (
              <li key={carrier}>
                {carrier}: ₹{price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FlightSearchAPI;
