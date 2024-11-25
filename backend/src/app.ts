import express, { Request, Response } from 'express';

const app = express();

app.use(express.json())

app.get("/",
  (req: Request, res: Response): any => res.status(200).json({ message: "teste" })
);

app.post("/ride/estimate", async (req: Request, res: Response): Promise<any> => {

  const roadInfos = req.body;

  if (!roadInfos.hasOwnProperty("origin")) return res.status(400).json({ errorMessage: "A origem não foi informada!" })
  if (!roadInfos.hasOwnProperty("destination")) return res.status(400).json({ errorMessage: "O destino não foi informado!" })
  if (!roadInfos.hasOwnProperty("id")) return res.status(400).json({ errorMessage: "User sem ID!" })

  const { origin, destination, id } = roadInfos;

  if (origin === destination) return res.status(400).json({ errorMessage: "Origem e destino não podem ser iguais!" })


  // TODO: Validar se origem e destino são locais diferentes
  // TODO: Chamar API GOOGLE MAPS
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
