import { Injectable } from '@nestjs/common';

import axios from 'axios';
import { DATA_ANALYSIS_URL } from 'src/domain/consts/api.consts';

@Injectable()
export class DataAnalysService {
  public async isPropaganda(msgs: string[]): Promise<boolean[]> {
    return axios
      .post(DATA_ANALYSIS_URL + '/is-propaganda', { msgs })
      .then((response) => {
        console.log('Response:', response.data);
        return response.data.is_propaganda;
      })
      .catch((error) => {
        throw error;
      });
  }

  public async getTopics(
    msgs: string[],
  ): Promise<{ topicId: string; clearedText: string }[]> {
    return axios
      .post(DATA_ANALYSIS_URL + '/topics', { msgs })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
}
