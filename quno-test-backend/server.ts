import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import {QuestionnaireSession} from "./questionnaire";
import questionaireData from "./sampleQuestionaire.json";

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(cors());

const session = new QuestionnaireSession([],questionaireData)


app.get("/getResult", (req: Request, res: Response) => {
    res.json(session.getResult());
});

app.get("/getState", (req: Request, res: Response) => {

    if(finished){
        res.json({
            finished:true
        });
        return
    }

    session.getCurrentScreen()

    res.json({
        screen:session.getCurrentScreen(),
        progress: session.getProgress()
    });

});

let finished=false

app.post("/setValueAnGoNext", (req: Request, res: Response) => {
    session.setValue(req.body.value)
    
    if(session.goNext()){
        res.json({
            screen:session.getCurrentScreen(),
            progress: session.getProgress()
        });
    } else{
        finished=true
        res.json({
            finished:true
        });
    }
});

app.post("/reset", (req: Request, res: Response) => {
    finished=false
    session.reset()
    res.json({
        screen:session.getCurrentScreen(),
        progress: session.getProgress()
    });
});

app.post("/goBack", (req: Request, res: Response) => {
    finished=false
    session.goBack()
    res.json({
        screen:session.getCurrentScreen(),
        progress: session.getProgress()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

