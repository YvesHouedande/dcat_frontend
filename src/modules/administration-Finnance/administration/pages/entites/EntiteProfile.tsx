// src/components/EntiteProfile.tsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Home,
  Edit,
  ArrowLeft,
  Users,
  ExternalLink,
} from "lucide-react";
import { useEntiteApi } from "@/modules/administration-Finnance/services/entiteService";
import { usePartenaireApi } from "@/modules/administration-Finnance/services/partenaireService";

const EntiteProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchEntiteById } = useEntiteApi();
  const { fetchPartnerById } = usePartenaireApi();

  // Charger l'entité
  const {
    data: entite,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["entite", id],
    queryFn: () => fetchEntiteById(parseInt(id!)),
    enabled: !!id,
  });

  // Charger le partenaire associé si l'entité en a un
  const { data: partenaire, isLoading: loadingPartenaire } = useQuery({
    queryKey: ["partenaire", entite?.id_partenaire],
    queryFn: () => fetchPartnerById(entite!.id_partenaire!),
    enabled: !!entite && !!entite.id_partenaire && entite.id_partenaire > 0,
  });

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement du profil de l'entité...</div>
      </div>
    );
  }

  if (error || !entite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Erreur lors du chargement de l'entité
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/gestion-administrative/entites")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Profil de l'entité
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Informations principales */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Informations générales
                  </CardTitle>
                  <Link
                    to={`/gestion-administrative/entites/${entite.id_entite}/editer`}
                  >
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar et nom */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-gray-200">
                    <AvatarFallback className="bg-blue-500 text-white text-xl">
                      {getInitials(entite.denomination)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {entite.denomination}
                    </h2>
                    {entite.abreviation_nom && (
                      <Badge variant="secondary" className="mt-1">
                        {entite.abreviation_nom}
                      </Badge>
                    )}
                    {/* <p className="text-sm text-gray-500 mt-1">
                      ID: {entite.id_entite}
                    </p> Utilisez le si vous voulez voir l'id de l'entité */}
                  </div>
                </div>

                <Separator />

                {/* Détails */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {entite.contact && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Contact
                        </p>
                        <p className="text-sm text-gray-600">
                          {entite.contact}
                        </p>
                      </div>
                    </div>
                  )}

                  {entite.localisation && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Localisation
                        </p>
                        <p className="text-sm text-gray-600">
                          {entite.localisation}
                        </p>
                      </div>
                    </div>
                  )}

                  {entite.adresse_postal && (
                    <div className="flex items-start space-x-3 sm:col-span-2">
                      <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Adresse postale
                        </p>
                        <p className="text-sm text-gray-600">
                          {entite.adresse_postal}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Relations */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Relations</CardTitle>
              </CardHeader>
              <CardContent>
                {entite.id_partenaire && entite.id_partenaire > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Partenaire associé
                          </p>
                          {loadingPartenaire ? (
                            <p className="text-sm text-gray-600">
                              Chargement...
                            </p>
                          ) : partenaire ? (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600 font-medium">
                                {partenaire.nom_partenaire}
                              </p>
                              <p className="text-xs text-gray-500">
                                {partenaire.specialite}
                              </p>
                              <p className="text-xs text-gray-500">
                                {partenaire.type_partenaire}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Partenaire ID: {entite.id_partenaire}
                            </p>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/gestion-administrative/partenaires/${entite.id_partenaire}`}
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Voir le partenaire
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Aucun partenaire associé
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Cette entité n'est pas encore associée à un partenaire.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de droite */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  to={`/gestion-administrative/entites/${entite.id_entite}/editer`}
                >
                  <Button className="w-full" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier l'entité
                  </Button>
                </Link>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/gestion-administrative/entites")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la liste
                </Button>
              </CardContent>
            </Card>

            {/* Informations système */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ID Entité</span>
                  <span className="text-sm font-medium">
                    {entite.id_entite}
                  </span>
                </div>

                {entite.id_partenaire && entite.id_partenaire > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ID Partenaire</span>
                    <span className="text-sm font-medium">
                      {entite.id_partenaire}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="text-xs text-gray-500">
                  <p>Dernière mise à jour: Récente</p>
                  <p>Statut: Actif</p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntiteProfile;
