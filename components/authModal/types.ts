export type AuthMode = 'signin' | 'signup' | 'verify';

export type AuthFormProps = {
  initialMode?: AuthMode;
  nextPath?: string;
  onSuccess?: () => void;
  embedded?: boolean;
};
