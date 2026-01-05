
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
