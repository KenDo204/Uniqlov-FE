import { Link } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { NAVIGATION_DATA } from '@/constants/navigation';

export function HeaderMegaMenu() {
  return (
    <NavigationMenu className="mx-auto" align="center">
      <NavigationMenuList className="flex space-x-6 lg:space-x-2">
        {NAVIGATION_DATA.map((category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuTrigger className="relative flex items-center justify-center h-10 px-1 text-[14px] font-normal tracking-widest text-white bg-transparent hover:bg-transparent focus:bg-transparent data-open:bg-transparent rounded-none border-b-2 border-transparent data-open:border-accent data-popup-open:border-accent hover:text-accent transition-all cursor-pointer">
              {category.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-[100vw] max-w-6xl bg-white border border-border-base shadow-2xl p-8 grid grid-cols-12 gap-8 outline-none rounded-none">
              {/* Left side: Navigation links (9 columns) */}
              <div className="col-span-9 grid grid-cols-4 gap-6 text-left">
                {category.groups.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col space-y-3">
                    <h3 className="font-extrabold text-[13px] tracking-wider text-primary border-b border-border-base pb-2">
                      {group.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {group.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <NavigationMenuLink
                            render={<Link to={item.href} />}
                            className="text-[13px] text-gray-600 hover:text-accent hover:underline block py-0.5 transition-colors font-medium"
                          >
                            {item.label}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Right side: Featured card (3 columns) */}
              <div className="col-span-3 flex flex-col justify-between border-l border-border-base pl-8 text-left">
                <div>
                  <h3 className="font-extrabold text-[13px] tracking-wider text-primary mb-3">
                    FEATURED
                  </h3>
                  <div className="relative aspect-16/10 w-full overflow-hidden mb-3 bg-muted">
                    <img
                      src={category.featured.image}
                      alt={category.featured.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-[14px] text-primary mb-1">
                    {category.featured.title}
                  </h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                    {category.featured.description}
                  </p>
                </div>
                <NavigationMenuLink
                  render={<Link to={category.featured.href} />}
                  className="inline-block text-[12px] font-extrabold tracking-wider underline hover:text-accent transition-colors self-start"
                >
                  SHOP NOW
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
