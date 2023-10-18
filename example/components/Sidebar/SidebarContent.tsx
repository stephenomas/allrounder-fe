import Link from 'next/link'
import routes, { routeIsActive } from 'routes/sidebar'
import * as Icons from 'icons'
import { IIcon } from 'icons'
import SidebarSubmenu from './SidebarSubmenu'
import { Button } from '@roketid/windmill-react-ui'
import { useRouter } from 'next/router'
import Image from "next/image";
import classNames from 'classnames';

function Icon({ icon, ...props }: IIcon){
  // @ts-ignore
  const Icon= Icons[icon]
  return <Icon {...props} />
}

interface ISidebarContent{
  linkClicked: () => void
}

function SidebarContent({ linkClicked }: ISidebarContent) {
  const { pathname } = useRouter();
  const appName = process.env.NEXT_PUBLIC_APP_NAME
    const imgSource = "/assets/img/logo-dark.png";

  return (
    <div className="text-gray-500 dark:text-gray-400">
      <div className="translate-x-10 translate-y-1">
        <Link href="/#" passHref>
          <Image
            aria-hidden="true"
            className="object-cover"
            src={imgSource}
            alt="Office"
            width={80}
            height={80}
          />
        </Link>
      </div>

      <ul>
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu
              route={route}
              key={route.name}
              linkClicked={linkClicked}
            />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <Link href={route.path || "#"} scroll={false}>
                <a
                  className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                    routeIsActive(pathname, route)
                      ? "dark:text-gray-100 text-gray-800"
                      : ""
                  }`}
                  onClick={linkClicked}
                >
                  {routeIsActive(pathname, route) && (
                    <span
                      className="absolute inset-y-0 left-0 w-1 background-primary-color rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  )}

                  <Icon
                    className="w-5 h-5"
                    aria-hidden="true"
                    icon={route.icon || ""}
                  />
                  <span className="ml-4">{route.name}</span>
                </a>
              </Link>
            </li>
          )
        )}
      </ul>
      
    </div>
  );
}

export default SidebarContent