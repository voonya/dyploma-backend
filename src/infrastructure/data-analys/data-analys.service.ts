import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { spawn } from 'child_process';
import { resolve } from 'path';
import axios from 'axios';

@Injectable()
export class DataAnalysService implements OnApplicationBootstrap {
  private readonly DATA_ANALYSIS_URL = 'http://localhost:5000';
  async onApplicationBootstrap() {
    //await this.isPropaganda(['Хохлы бандеровцы 228?', 'Погода в москве сегодня']);

    //console.log(await this.getCommentForMessage("восточный ангара ракета космос"))
  }

  public async isPropaganda(msgs: string[]): Promise<boolean[]> {
    return axios.post(this.DATA_ANALYSIS_URL + '/is-propaganda', {msgs})
      .then(response => {
        console.log('Response:', response.data);
        return response.data.is_propaganda
      })
      .catch(error => {
        throw error;
    });
  }

  public async getCommentForMessage(msgs: string[]): Promise<{msg: string, topicWords: string, clearedText: string}[]> {
    const topicResponse = await this.getTopics(msgs);

    return topicResponse.map((el: any) => (({msg: this.getMessageForTopic(el.topicId, el.topicWords), ...el}))); 
  }

  public async getTopics(msgs: string[]): Promise<{topicId: string, topicWords: string, clearedText: string}[]> {
    return axios.post(this.DATA_ANALYSIS_URL + '/topics', {msgs})
      .then(response => {
        console.log('Response:', response.data);
        const data =  response.data
        return data.topic_words.map((el: any, idx: number) => (({msg: this.getMessageForTopic(data.topic_ids[idx], el), topicWords: el, clearedText: data.cleared_texts[idx]})))
      })
      .catch(error => {
        throw error;
    });
    // const process = spawn('python', ['./src/infrastructure/data-analys/python-scripts/get-topic.py', JSON.stringify(msgs)]);

    // const data = new Promise((resolve) => {
    //   process.stdout.on('data', data => {
    //     try {
    //       resolve(JSON.parse(data.toString()))
    //     } catch(e) {
    //       console.log("ERROR", msgs, data.toString())
    //       resolve({'topic_ids': [], 'topic_words': [], 'cleared_texts': []})
    //       //throw e;
    //     }
        
    // });

    //   process.on('close', (code) => {
    //     resolve({error: `Some error with code: ${code}`})
    //   });
    // });

    // return data;
  }

  public getMessageForTopic(topicId: string, topicWords: string) {  
    if(topicWords.includes('ангара') && topicWords.includes('носитель')) {
      return "Зачем тратят деньги на строительство ракет, оно и так не полетит, сколько уже за год таких разбилось"
    } else if(topicWords.includes('помощь') && topicWords.includes('реквизиты')) {
      return "А отчеты точно будут после сбора, а то знаю, что частенько такие 'сборы' идут автору в карман, а не нашим парням?"
    }

    return "русня пидарасы!"
  }
}
