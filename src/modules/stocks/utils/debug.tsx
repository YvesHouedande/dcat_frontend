import { UseFormReturn, FieldValues } from "react-hook-form";

function DebugZod<T extends FieldValues>({ form }: { form: UseFormReturn<T> }) {
  return (
    <div>
      {/* DEBUG TEMPORAIRE : Affichage des données et erreurs Zod */}
      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-gray-800">
        <div className="font-bold mb-1">[DEBUG] Données à envoyer :</div>
        <pre className="overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(form.getValues(), null, 2)}
        </pre>
        <div className="font-bold mt-2 mb-1">[DEBUG] Erreurs Zod :</div>
        <pre className="overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(form.formState.errors, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DebugZod;
