import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { useTheme } from '../../utils/Provider/ThemeContext';


const Footer = ({webSettingName}) => {

    const theme = useTheme()
    // console.log("🚀 ~ Footer ~ theme:", theme)

    return (
        <footer style={{ backgroundColor: `${theme.theme.navbarBackgroundColor}`,color: `${theme.theme.navbarTextColor}` }} className="p-3 mt-auto">
            <div className="container mx-auto px-4">
                {/* Top Section: Company Info */}
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"> */}
                    {/* Company Information 
                    <div>
                        <h3 className="font-bold text-lg mb-2">About Us</h3>
                        <ul className="space-y-2 ">
                            <li><a href="#" className="hover:underline">Our Story</a></li>
                            <li><a href="#" className="hover:underline">Careers</a></li>
                            <li><a href="#" className="hover:underline">Sustainability</a></li> 
                            <li><a href="#" className="hover:underline">Blog</a></li> 
                        </ul>
                    </div>*/}

                    {/* Customer Service */}
                    <div>
                       {/*  <h3 className="font-bold text-lg mb-2">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Contact Us</a></li>
                            <li><a href="#" className="hover:underline">Returns & Exchanges</a></li>
                            <li><a href="#" className="hover:underline">Shipping Information</a></li>
                            <li><a href="#" className="hover:underline">FAQs</a></li>
                        </ul>*/}
                    </div> 

                    {/* Categories */}
                   <div>
                       {/*   <h3 className="font-bold text-lg mb-2">Categories</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Books</a></li>
                        </ul>*/}
                    </div> 

                    {/* Social Media Links */}
                    {/*<div>
                        <h3 className="font-bold text-lg mb-2">Follow Us</h3>
                        <ul className="flex space-x-4">
                             <li>
                                <a href="#" className="flex items-center hover:underline">
                                    <FaFacebookF className="h-5 w-5" />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:underline">
                                    <FaInstagram className="h-5 w-5" />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center hover:underline">
                                    <FaTwitter className="h-5 w-5" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/multifacet-softwares-systems-private-limited/" className="flex items-center hover:underline">
                                    <FaLinkedinIn className="h-5 w-5" />
                                </a>
                            </li>
                        </ul>
                    </div> */}
                {/* </div> */}

                {/* Bottom Section: Copyright */}
                

                {/* <div className=" border-t border-gray-700 pt-6 pb-2"> */}
  <div className="container mx-auto text-center">
    <p className="text-sm md:text-base">
      Powered by{" "}
      <span className="font-semibold ">
      {webSettingName}
      </span>{" "}
      ❤️
    </p>
  </div>
</div>

            {/* </div> */}
        </footer>
    );
};

export default Footer;
