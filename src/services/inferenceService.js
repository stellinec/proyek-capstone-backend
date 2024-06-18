// const tf = require('@tensorflow/tfjs-node');
// const InputError = require('../exceptions/InputError');
 
// async function predictClassification(model, image) {
//     try {
//         const tensor = tf.node
//             .decodeJpeg(image)
//             .resizeNearestNeighbor([224, 224])
//             .expandDims()
//             .toFloat()
//         const classes = ['cardboard', 'compost', 'glass', 'metal', 'paper', 'plastic', 'trash'];
 
//         const prediction = model.predict(tensor);
//         console.log("gob")
//         const score = await prediction.data();
 
//         const classResult = tf.argMax(prediction, 1).dataSync()[0];
//         const label = classes[classResult];
 
//         let explanation, suggestion;
 
//         if(label === 'cardboard') {
//             explanation = "cardboard"
//         }
 
//         if(label === 'compost') {
//             explanation = "compost"
//         }
//         if(label === 'glass') {
//             explanation = "glass"
//         }
//         if(label === 'metal') {
//             explanation = "metal"
//         }
//         if(label === 'paper') {
//             explanation = "paper"
//         }
//         if(label === 'plastic') {
//             explanation = "plastic"
//         }
//         if(label === 'trash') {
//             explanation = "trash"
//         }
 
 
//         return { label, explanation };
//     } catch (error) {
//         throw new InputError(`Terjadi kesalahan input: ${error.message}`)
//     }
// }
 
// module.exports = predictClassification;