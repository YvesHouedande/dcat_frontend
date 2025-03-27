import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const DynamicBreadcrumb = () => {
  const location = useLocation();

  // Convertit le chemin en segments de breadcrumb
  const pathnames = location.pathname.split('/').filter(x => x);

  // Générer les liens breadcrumb
  const breadcrumbLinks = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;

    return {
      label: name.charAt(0).toUpperCase() + name.slice(1), // Première lettre en majuscule
      href: routeTo,
      isLast: isLast
    };
  });

  // Ajouter toujours un lien vers l'accueil
  const completeLinks = [
    { label: 'Accueil', href: '/', isLast: false },
    ...breadcrumbLinks
  ];

  return (
    <Breadcrumb className='py-2 hidden lg:block' >
      <BreadcrumbList className='text-xl font-semibold'>
        {completeLinks.map((item) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage className='font-semibold text-blue-600'>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild >
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;