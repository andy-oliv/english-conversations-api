export default interface User {
  id?: string;
  role?: string;
  name: string;
  birthdate: Date;
  email: string;
  country: string;
  state: string;
  city: string;
  password: string;
  refreshToken?: string;
  currentLevel?: string;
}
