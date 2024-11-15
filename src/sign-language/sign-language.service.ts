import { Injectable, OnModuleInit } from '@nestjs/common';
import * as ort from 'onnxruntime-node';
import * as path from 'path';

@Injectable()
export class SignLanguageService implements OnModuleInit {
  private session: ort.InferenceSession;

  async onModuleInit() {
    // Cargar el modelo ONNX al iniciar el módulo
    const session = 'C:/Users/alfre/OneDrive/Escritorio/SUF/backend-senalando-un-futuro/model/modelo.onnx';
    this.session = await ort.InferenceSession.create(session);
  }

  async predict(frames: number[]): Promise<number[]> {
    // Asegura que la entrada tiene 2520 elementos
    if (frames.length !== 2520) {
      throw new Error('La entrada debe contener exactamente 2520 elementos.');
    }

    const inputShape = [1, 20, 126];
    const inputTensor = new ort.Tensor('float32', new Float32Array(frames), inputShape);

    // Ejecuta la inferencia
    const feeds = { input_layer: inputTensor }; // Cambia `input_layer` por el nombre real de la entrada del modelo
    const results = await this.session.run(feeds);

    // Retorna los datos de salida (por ejemplo, una lista de probabilidades)
    return Array.from(results.output_0.data as Float32Array); // Cambia `output_0` por el nombre exacto de salida del modelo
  }
}
