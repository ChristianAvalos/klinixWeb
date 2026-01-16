<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'FirstName' => ['required', 'string'],
            'LastName' => ['required', 'string'],
            'Address' => ['required', 'string'],
            'CellPhoneNumber' => ['required', 'string'],
            'SupportWhatsapp' => ['boolean'],
            'PhoneNumber' => ['nullable', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'City_Id' => ['required', 'exists:ciudad,id'],
        ];
    }
    
    public function messages()
    {
        return [
            'FirstName.required' => 'El nombre es obligatorio.',
            'LastName.required' => 'El apellido es obligatorio.',
            'Address.required' => 'La dirección es obligatoria.',
            'CellPhoneNumber.required' => 'El número de celular es obligatorio.',
            'SupportWhatsapp.boolean' => 'El valor de WhatsApp debe ser verdadero o falso.',
            'PhoneNumber.string' => 'El número de teléfono debe ser un texto válido.',
            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'El correo no es válido.',
            'email.unique' => 'El correo ingresado ya existe.',
            'City_Id.required' => 'La ciudad es obligatoria.',
            'City_Id.exists' => 'La ciudad seleccionada no es válida.',
        ];
    }
}
