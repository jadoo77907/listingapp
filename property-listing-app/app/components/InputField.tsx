import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string
  id: string
  textarea?: boolean
}

export default function InputField({ label, id, textarea = false, ...props }: InputFieldProps) {
  const className = "mt-1 block w-full rounded-md border-border-light dark:border-border-dark shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-background-light dark:bg-surface-dark text-text-light dark:text-text-dark"

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-light dark:text-text-dark">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} className={className} rows={4} {...props as TextareaHTMLAttributes<HTMLTextAreaElement>} />
      ) : (
        <input id={id} className={className} {...props as InputHTMLAttributes<HTMLInputElement>} />
      )}
    </div>
  )
}

