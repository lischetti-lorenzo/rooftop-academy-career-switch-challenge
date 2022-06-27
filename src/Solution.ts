import fetch from 'node-fetch';

interface CheckResponse {
  message: boolean;
}

interface GetTokenResponse {
  token: string;
}

interface GetBlocksResponse {
  data: Array<string>;
}

export class Solution {
  static async main(): Promise<void> {
    const token = await this.getToken();
    const blocks = await this.getBlocks(token);
    const sortedArray = (await this.check(blocks, token)).join('');
    const result = await this.checkResult(sortedArray, token)

    if (result) {
      console.log("Lo resolviste correctamente!");
    } else {
      console.log("Todavía puedes intentarlo!");
    }
  }

  static async check(blocks: Array<string>, token: string): Promise<Array<string>> {
    const sortedArray: Array<string> = [];
    if (blocks && blocks.length > 0) {
      const firstElement = blocks.shift();
      if (firstElement) sortedArray.push(firstElement);

      let i = 0;
      // If it is the last element to check in the block array, we can be sure that it is the last
      // element in the sorted array, so we can finish the loop and push the element to the sortedArray
      while (blocks.length > 1 && i < blocks.length) {
        // If it is the last element to check, we can be sure that it is the next one in the array so
        // we don't need to call the API.
        const isConsecutive = i === blocks.length - 1 ? true : await this.checkIfConsecutive(sortedArray[sortedArray.length-1], blocks[i], token);
        if (isConsecutive) {
          sortedArray.push(blocks.splice(i,1)[0]);
          i = 0;
        } else {
          i++;
        }
      }

      sortedArray.push(blocks[0]);
    }

    return sortedArray;
  }

  private static async checkIfConsecutive(
    firstString: string,
    secondString: string,
    token:string
  ): Promise<boolean> {
    const response = await fetch(
      `https://rooftop-career-switch.herokuapp.com/check?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({   "blocks": [firstString, secondString]})
      }
    );

    const data = await response.json() as CheckResponse;
    return data.message;
  }

  private static async checkResult(sortedArrayAsString: string, token: string) {
    const response = await fetch(
      `https://rooftop-career-switch.herokuapp.com/check?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({   "encoded": sortedArrayAsString})
      }
    );

    const data = await response.json() as CheckResponse;
    return data.message;
  }

  private static async getToken(): Promise<string> {
    const response = await fetch('https://rooftop-career-switch.herokuapp.com/token?email=lischetti.lorenzo@gmail.com');
    const data = await response.json() as GetTokenResponse;
    return data.token;
  }

  private static async getBlocks(token: string): Promise<Array<string>> {
    const response = await fetch(`https://rooftop-career-switch.herokuapp.com/blocks?token=${token}`);
    const jsonResponse = await response.json() as GetBlocksResponse;
    return jsonResponse.data;
  }
}
