import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config()

app.use(express.json())

app.get("/",
  (req: Request, res: Response): any => res.status(200).json({ message: "teste" })
);



app.post("/ride/estimate", async (req: Request, res: Response): Promise<any> => {

  const roadInfos = req.body;

  if (!roadInfos.hasOwnProperty("origin")) return res.status(400).json({ errorMessage: "A origem não foi informada!" })
  if (!roadInfos.hasOwnProperty("destination")) return res.status(400).json({ errorMessage: "O destino não foi informado!" })
  if (!roadInfos.hasOwnProperty("curstomer_id")) return res.status(400).json({ errorMessage: "User sem ID!" })

  const { origin, destination, customer_id } = roadInfos;

  if (origin === destination) return res.status(400).json({ errorMessage: "Origem e destino não podem ser iguais!" })


  // TODO: Chamar API GOOGLE MAPS
  const test = fetch('https://routes.googleapis.com/directions/v0:computeRoutes', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY || '',
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    },
    body: JSON.stringfy({})
  })
  console.log(test)
  // TODO: Enviar locais para API
  // TODO: Calcular distância
  // TODO: Validar ERROR caso aconteça
  // TODO: Retorno da API : latitude e longitudo dos pontos inical e final.  
  // TODO: Retorno da API : motoristas disponivéis, ID, Nome, Descrição, Carro, Avaliação, Taxa
  // TODO: Ordenar por KM mínima
  // TODO: Retorno da API : Distância e tempo, Resposta original da rota do Google  



  console.log(roadInfos);



  return res.status(500).json({ errorMessage: "error" })
})



export default app;
