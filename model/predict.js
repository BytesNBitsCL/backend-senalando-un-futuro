const ort = require('onnxruntime-node');

async function predict(inputData) {
    try {
        const session = await ort.InferenceSession.create('C:/Users/alfre/OneDrive/Escritorio/SUF/backend-senalando-un-futuro/model/modelo.onnx');

        const inputShape = [1, 20, 126]; 

        const inputTensor = new ort.Tensor('float32', new Float32Array(inputData), inputShape);

        const feeds = { input_layer: inputTensor };  
        const results = await session.run(feeds);

        return results.output_0.data;  
    } 
    catch (error) {
        console.error('Error al ejecutar el modelo:', error);
    }
}
const inputData = Array(2520).fill(0); 
predict(inputData).then((output) => console.log('Predicción:', output));
