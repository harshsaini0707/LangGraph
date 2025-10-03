import {Annotation, StateGraph , START , END} from "@langchain/langgraph"

//define state before making the graph

// 1. Define the state schema
const State = Annotation.Root({
  height: Annotation<string>(),
  weight: Annotation<string>(),
  result: Annotation<number>(),
});
// Without Annotation, StateGraph doesn’t know what type of state you want to flow through the graph.

// 2. Create the graph
const graph = new StateGraph(State);


//add nodes

// Node 1: calculate BMI
graph.addNode("calculateBMI", async (state: typeof State.State) => {
  const h = parseFloat(state.height);
  const w = parseFloat(state.weight);
  const bmi = w / (h * h);
  state.result = bmi
  return state;
});



/**
 * START , END they were just like a dummy node that tell that from where graph starts and ends
 */

// add edges
graph.addEdge(START , 'calculateBMI');
graph.addEdge('calculateBMI' , END)


//compile the graph

const app =  graph.compile(); //return a compiles graph object


//execute the graph

(async () => {
  const result = await app.invoke({ height: "1.80", weight: "75" });
  console.log(Math.round(result.result)); // return a final/output state

})();




