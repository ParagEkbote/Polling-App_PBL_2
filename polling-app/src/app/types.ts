// types.ts
export interface Option {
  id: string;
  text: string;        //Attributes of the data to be entered in the database.
  votes: number;
}

export interface Poll {
  id: string;            //Attributes of the data to be entered in the database.
  question: string;
  options: Option[]; 
}
