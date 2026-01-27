<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePatientsRequest extends FormRequest
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
            'Id_Type_People' => ['required', 'exists:type_people,id'],
            'FirstName' => ['required', 'string', 'max:150'],
            'LastName' => ['required', 'string', 'max:150'],
            'DocumentNo' => ['required', 'string', 'max:30'],
            'Id_Sex' => ['required', 'exists:sexes,id'],
            'Department_Id' => ['required', 'exists:departamento,id'],
            'City_Id' => ['required', 'exists:ciudad,id'],

            'PatientCode' => ['required','unique:patients,PatientCode', 'string', 'max:10'],
            'Title' => ['nullable', 'string', 'max:30'],
            'Nationality' => ['nullable', 'string', 'max:100'],
            'Birthday' => ['nullable', 'date'],

            'Address' => ['nullable', 'string', 'max:250'],
            'Neighborhood' => ['nullable', 'string', 'max:150'],
            'District' => ['nullable', 'string', 'max:100'],

            'PhoneNumber' => ['nullable', 'string', 'max:30'],
            'CellPhoneNumber' => ['nullable', 'string', 'max:30'],
            'SupportWhatsapp' => ['nullable', 'boolean'],
            'Email' => ['nullable', 'email', 'max:200'],

            'Notes' => ['nullable', 'string', 'max:1000'],
            'BloodType' => ['nullable', 'string', 'max:2'],
            'RHFactor' => ['nullable', 'string', 'max:1'],
            'Allergies' => ['nullable', 'string', 'max:500'],
            'MedicalInsurance' => ['nullable', 'string', 'max:500'],
            'MedicalDiagnosis' => ['nullable', 'string', 'max:500'],

            'MaritalStatus_Id' => ['nullable', 'exists:marital_statuses,id'],

            'DeathDate' => ['nullable', 'date'],
            'DeathCause' => ['nullable', 'string', 'max:500'],
            'DeathPlace' => ['nullable', 'string', 'max:100'],
            'DeathCertificateNumber' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages()
    {
        return [
            'Id_Type_People.required' => 'El tipo de persona es obligatorio.',
            'Id_Type_People.exists' => 'El tipo de persona seleccionado no es válido.',
            'FirstName.required' => 'El nombre es obligatorio.',
            'LastName.required' => 'El apellido es obligatorio.',
            'DocumentNo.required' => 'El número de documento es obligatorio.',
            'Id_Sex.required' => 'El sexo es obligatorio.',
            'Id_Sex.exists' => 'El sexo seleccionado no es válido.',
            'Department_Id.required' => 'El departamento es obligatorio.',
            'Department_Id.exists' => 'El departamento seleccionado no es válido.',
            'City_Id.required' => 'La ciudad es obligatoria.',
            'City_Id.exists' => 'La ciudad seleccionada no es válida.',
            'PatientCode.required' => 'El código de paciente es obligatorio.',
            'PatientCode.unique' => 'El código de paciente ya está en uso.',
            'PatientCode.string' => 'El código de paciente debe ser una cadena de texto.',
            'PatientCode.max' => 'El código de paciente no debe exceder los 10 caracteres.',
            'MaritalStatus_Id.exists' => 'El estado civil seleccionado no es válido.',
        ];
    }
}
