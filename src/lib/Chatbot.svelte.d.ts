import { SvelteComponentTyped } from "svelte";

export interface ChatbotProps {
    extractedData: any;
    userEmail: string;
  }
  export default class Chatbot extends SvelteComponentTyped<
  ChatbotProps,
  { close: void },
  {}
> {}

export default class Chatbot extends SvelteComponentTyped<ChatbotProps> {}