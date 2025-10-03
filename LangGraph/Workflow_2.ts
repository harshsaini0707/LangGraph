import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import{Annotation , StateGraph , START , END} from "@langchain/langgraph"
import dotenv from "dotenv";
dotenv.config()

const State =  Annotation.Root({
    question : Annotation<string>(),
    answer : Annotation<string>(),
    
})
 

const LLM_QA =  async(state : typeof State.State) =>{
    //extract the question friom state

    const ques = state.question

    //form a prompt
    const prompt =  `Answer the following question uder 2-3 lines :- ${ques}`

    //ask that question to LLM
    const llm = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY!,
        model :"gemini-2.5-flash-lite",
        temperature:0.3
    })
    const response = await llm.invoke([
        {role :"system" , content :"You answer the asked question "},
        {role :"user" ,  content : prompt}
    ])

    //console.log(response.content);
    
     // Return partial state update
     return { answer: response.content };
}



const graph = new StateGraph(State);

// node
graph.addNode("LLM_QA" , LLM_QA)


//edge
graph.addEdge(START , "LLM_QA");
graph.addEdge("LLM_QA", END);

//compile 

const app = graph.compile();


//execute
( async()=>{ 
const result = await app.invoke({question :"What is GPU??"})
console.log(result);

})();