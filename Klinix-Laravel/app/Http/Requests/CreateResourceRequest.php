<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateResourceRequest extends FormRequest
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
            'ResourceName' => ['required', 'string', 'max:255'],
            'ResourceNumber' => ['required', 'integer'],
            'Id_Doctor' => ['required', 'exists:doctors,id'],

            'ResourceColor' => ['nullable', 'integer'],
            'ResourceVisible' => ['nullable', 'in:0,1'],
            'ResourceWorkStart' => ['required', 'date_format:Y-m-d H:i:s'],
            'ResourceWorkFinish' => ['required', 'date_format:Y-m-d H:i:s'],
        ];
    }

    public function messages()
    {
        return [
            'ResourceName.required' => 'El nombre es obligatorio.',
            'ResourceName.string' => 'El nombre debe ser un texto válido.',
            'ResourceName.max' => 'El nombre no debe superar 255 caracteres.',

            'ResourceNumber.required' => 'El número es obligatorio.',
            'ResourceNumber.integer' => 'El número debe ser un valor numérico.',

            'Id_Doctor.required' => 'El doctor es obligatorio.',
            'Id_Doctor.exists' => 'El doctor seleccionado no es válido.',

            'ResourceColor.integer' => 'El color debe ser un número entero.',
            'ResourceVisible.in' => 'El valor de visible debe ser 0 o 1.',

            'ResourceWorkStart.date_format' => 'La hora de inicio no tiene un formato válido.',
            'ResourceWorkFinish.date_format' => 'La hora de fin no tiene un formato válido.',
            'ResourceWorkStart.required' => 'La hora de inicio es obligatoria.',
            'ResourceWorkFinish.required' => 'La hora de fin es obligatoria.',

        ];
    }
}
