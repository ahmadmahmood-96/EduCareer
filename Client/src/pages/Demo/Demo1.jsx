import React from 'react';
import Topbar from '../../components/Topbar/Topbar';
import TopbarItems from '../../components/Topbar/TopbarItems';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faClipboard, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const topbarItems = [
  { link: "Home", path: "home" },
  { link: "About", path: "about" },
  { link: "Features", path: "card" },
  { link: "Vendor", path: "vendor" },
  { link: "Contact Us", path: "contact us" },
];

const topbarItemsRight = [
  { link: "Sign up", path: "/sign-up" },
  { link: "Sign in", path: "/sign-in" },
];


const Demo1 = () => {
  return (
    <div>
      <Topbar TopbarItems={navItems} TopItemsRight={navItemsRight} />
    </div>
  );
};

export default Demo1;