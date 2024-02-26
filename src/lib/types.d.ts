import { FormikContextType } from "formik";

export interface DefaultProps extends Links {
  children: Children["children"];
}
export interface AuthFormProps {
  children: Children["children"];
  formik: FormikContextType<{ [key: string]: string }>;
  title: string;
}

export interface Links {
  title: string;
  link?: Url;
}

export interface Children {
  children: React.ReactNode; //| JSX.Element[] | JSX.Element
}

export interface UserInt {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  sex: string;
  address: string[];
  lat_long: string[];
  socials: string[];
  referral_code: string;
  referred_by: string;
}

export interface ValidationError {
  //   message: string;
  //   code: string;
}

export interface ValidationErrors {
  [key: string]: ValidationError[];
}
