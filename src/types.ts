export interface User {
  id: number;
  email: string;
  full_name: string;
  has_active_subscription: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
}

export interface WordSet {
  id: number;
  category: number;
  level: string;
  title: string;
  order: number;
  word_count: number;
  locked: boolean;
}

export interface WordCard {
  id: number;
  text: string;
  part_of_speech: string;
  level: string;
  is_demo: boolean;
}

export interface Definition {
  id: number;
  text: string;
  part_of_speech: string;
  simple_definition: string;
  example_sentence: string;
  level: string;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  price: string;
  currency: string;
  duration_days: number;
  description: string;
}

export interface ExampleQuestion {
  id: number;
  question_text: string;
  options: string[] | null;
  answer: string;
  source: string;
  year: number | null;
}
