import express, { Request, Response } from 'express';

const app = express();

app.use(express.json())

app.get("/",
  (req: Request, res: Response): any => res.status(200).json({ message: "teste" })
);

app.post("/ride/estimate", async (req: Request, res: Response): Promise<any> => {

  // TODO: Pegar local de origim, destino, ID do user
  // TODO: Validar se alguma variável está vazia
  // TODO: Validar se origem e destino são locais diferentes
  // TODO: Chamar API GOOGLE MAPS
  // TODO: Enviar locais para API
  // TODO: Calcular distância
  // TODO: Validar ERROR caso aconteça
  // TODO: Retorno da API : latitude e longitudo dos pontos inical e final.  
  // TODO: Retorno da API : motoristas disponivéis, ID, Nome, Descrição, Carro, Avaliação, Taxa
  // TODO: Ordenar por KM mínima
  // TODO: Retorno da API : Distância e tempo, Resposta original da rota do Google  



  const roadInfos = req.body;
  console.log(roadInfos);



  return res.status(500).json({ error: "error" })
})

export default app;
