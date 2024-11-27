import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { motoristas } from "./motoristas"
import { loadData, saveData } from './utils/saveDB';

const app = express();
dotenv.config()

app.use(express.json())

app.get("/",
  (req: Request, res: Response): any => res.status(200).json({ message: "teste" })
);



app.post("/ride/estimate", async (req: Request, res: Response): Promise<any> => {

  const roadInfos = req.body;

  if (
    !roadInfos.hasOwnProperty("origin")
    || !roadInfos.hasOwnProperty("destination")
    || !roadInfos.hasOwnProperty("customer_id")) return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os dados fornecidos no corpo da requisição são inválidos"
    })

  const { origin, destination } = roadInfos;

  if (origin === destination) return res.status(400).json({
    error_code: "INVALID_DATA",
    error_description: "Os dados fornecidos no corpo da requisição são inválidos"
  })

  const responseAPI = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY || '',
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation',
    },
    body: JSON.stringify({
      "origin": { "address": origin },
      "destination": { "address": destination },
      "travelMode": "DRIVE"
    })
  }).then(response => response.json())

  const originLocation = responseAPI.routes[0].legs[0].startLocation.latLng
  const endLocation = responseAPI.routes[0].legs[0].endLocation.latLng

  const options = motoristas
    .filter(({ km_minim }: { km_minim: number }) => km_minim * 1000 < responseAPI.routes[0].distanceMeters)
    .map(({ id, taxa, nome, descrição, carro, avaliação, comentário }) => {

      const result = {
        id,
        name: nome,
        description: descrição,
        vehicle: carro,
        review: {
          rating: avaliação,
          comment: comentário
        },
        value: taxa
      }
      return result

    })

  const response = {
    "origin": {
      "latitude": originLocation.latitude,
      "longitude": originLocation.longitude,
    },
    "destination": {
      "latitude": endLocation.latitude,
      "longitude": endLocation.longitude
    },
    "distance": responseAPI.routes[0].distanceMeters,
    "duration": responseAPI.routes[0].duration,
    options,
    "routeResponse": responseAPI
  }
  return res.status(200).json(response)
})


app.patch("/ride/confirm", (req: Request, res: Response): any => {
  const roadInfos = req.body;

  if (
    !roadInfos.hasOwnProperty("origin")
    || !roadInfos.hasOwnProperty("destination")
    || !roadInfos.hasOwnProperty("customer_id")) return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os dados fornecidos no corpo da requisição são inválidos"
    })

  const { origin, destination, driver, distance } = roadInfos;

  if (origin === destination) return res.status(400).json({
    error_code: "INVALID_DATA",
    error_description: "Os dados fornecidos no corpo da requisição são inválidos"
  })

  const validateDriver = motoristas.find(({ id }: { id: number }): Boolean => id === driver.id)

  if (!validateDriver) return res.status(404).json({
    error_code: "DRIVER_NOT_FOUND",
    error_description: "Motorista não encontrado"
  })

  const validateDistance = validateDriver.km_minim * 1000 < distance

  if (!validateDistance) return res.status(406).json({
    error_code: "INVALID_DISTANCE",
    error_description: "Distância inválida"
  })

  const data = loadData()
  roadInfos.date = new Date().toLocaleString()
  data.push(roadInfos)
  saveData(data)

  console.log(data);


  return res.status(200).json({ success: true })
})

app.get("/ride/:customer_id", (req: Request, res: Response): any => {
  const { customer_id } = req.params
  const { driver_id } = req.query


  if (!customer_id) return res.status(400).json({
    error_code: "INVALID_CUSTOMER",
    error_description: "Customer inválido"
  })

  if (!driver_id) return res.status(400).json({
    error_code: "INVALID_DRIVER",
    error_description: "Motorista inválido"
  })

  const data = loadData()
  const rides = data.filter((ride: any) => ride.customer_id === +customer_id);

  if (rides.length < 1) return res.status(404).json({
    error_code: "NO_RIDES_FOUND",
    error_description: "Nenhum registro encontrado"
  })


  const result = rides.map((ride: any) => {
    return {
      id: customer_id,
      date: ride.date,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: ride.driver,
      value: ride.value
    }

  })

  console.log(result);

  return res.status(200).json({
    customer_id,
    rides
  })
})

export default app;
