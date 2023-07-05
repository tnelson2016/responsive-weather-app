import hotBg from './assets/hot.png'
import coldBg from './assets/cold.png'

import { Descriptions } from './components/Descriptions'
import { useEffect, useState } from 'react'
import { getFormattedWeatherData } from './weatherService'

function App() {
    const [city, setCity] = useState('Charleston')
    const [weather, setWeather] = useState(null)
    const [units, setUnits] = useState('imperial')
    const [bg, setBg] = useState(hotBg)

    useEffect(() => {
        const fetchWeatherData = async () => {
            const data = await getFormattedWeatherData(city, units)
            setWeather(data)

            //dynamic background
            const threshold = units === 'metric' ? 20 : 78
            if (data.temp <= threshold) setBg(coldBg)
            else setBg(hotBg)
        }

        fetchWeatherData()
    }, [units, city])

    //Changes button from °F to °C
    const handleUnitsClick = (e) => {
        const button = e.currentTarget
        const currentUnit = button.innerText.slice(1)
        const isCelsius = currentUnit === 'C'
        button.innerText = isCelsius ? '°F' : '°C'
        setUnits(isCelsius ? 'metric' : 'imperial')
    }
    const enterKeyPressed = (e) => {
        if (e.keyCode === 13) {
            setCity(e.currentTarget.value)
            e.currentTarget.blur()
        }
    }

    return (
        <div className="app" style={{ backgroundImage: `url(${bg})` }}>
            <div className="overlay">
                {weather && (
                    <div className="container">
                        <h1 className="title">Troy's Real Time Weather App</h1>

                        <div className="section section__inputs">
                            <input
                                onKeyDown={enterKeyPressed}
                                type="text"
                                name="city"
                                placeholder="Enter City..."
                            />
                            <button onClick={(e) => handleUnitsClick(e)}>
                                °F
                            </button>
                        </div>
                        <div className="section section__temperature">
                            <div className="icon">
                                <h3>{`${weather.name}, ${weather.country}`}</h3>
                                <img src={weather.iconURL} alt="weatherIcon" />
                                <h3>{weather.description}</h3>
                            </div>
                            <div className="temperature">
                                <h1>{`${weather.temp.toFixed()} ° ${
                                    units === 'metric' ? `C` : 'F'
                                }`}</h1>
                            </div>
                        </div>

                        {/*bottom description*/}
                        <Descriptions weather={weather} units={units} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
