import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { CookieIcon } from "lucide-react";

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="text-3xl font-bold">
            <span className="text-yellow-300">Sri</span>
            <span className="text-white">Match</span>
            <span className="text-pink-300 ml-1">♥</span>
          </Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-6">
              <CookieIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">
                Cookie Policy
              </h1>
            </div>
            <p className="text-gray-600 mb-6">Last Updated: June 1, 2023</p>
            <div className="prose max-w-none text-gray-700">
              <p>
                This Cookie Policy explains how SriMatch ("we", "us", or "our")
                uses cookies and similar technologies to recognize you when you
                visit our website and mobile application (collectively, the
                "Platform"). It explains what these technologies are and why we
                use them, as well as your rights to control our use of them.
              </p>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                1. What are Cookies?
              </h2>
              <p>
                Cookies are small data files that are placed on your computer or
                mobile device when you visit a website. Cookies are widely used
                by website owners to make their websites work, or to work more
                efficiently, as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, SriMatch) are
                called "first-party cookies". Cookies set by parties other than
                the website owner are called "third-party cookies". Third-party
                cookies enable third-party features or functionality to be
                provided on or through the website (e.g., advertising,
                interactive content, and analytics). The parties that set these
                third-party cookies can recognize your computer both when it
                visits the website in question and also when it visits certain
                other websites.
              </p>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                2. Why Do We Use Cookies?
              </h2>
              <p>
                We use first-party and third-party cookies for several reasons.
                Some cookies are required for technical reasons in order for our
                Platform to operate, and we refer to these as "essential" or
                "strictly necessary" cookies. Other cookies also enable us to
                track and target the interests of our users to enhance the
                experience on our Platform. Third parties serve cookies through
                our Platform for advertising, analytics, and other purposes.
              </p>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                3. Types of Cookies We Use
              </h2>
              <p>
                The specific types of first and third-party cookies served
                through our Platform and the purposes they perform are described
                below:
              </p>
              <h3 className="text-lg font-medium mt-6 mb-3">
                3.1 Essential Cookies
              </h3>
              <p>
                These cookies are strictly necessary to provide you with
                services available through our Platform and to use some of its
                features, such as access to secure areas. Because these cookies
                are strictly necessary to deliver the Platform, you cannot
                refuse them without impacting how our Platform functions.
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Authentication cookies: To recognize you when you log in to
                  our Platform
                </li>
                <li>
                  Security cookies: To protect user accounts, including
                  preventing fraudulent use of login credentials
                </li>
                <li>
                  Session cookies: To maintain your session while you use our
                  features
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-6 mb-3">
                3.2 Performance and Functionality Cookies
              </h3>
              <p>
                These cookies are used to enhance the performance and
                functionality of our Platform but are non-essential to their
                use. However, without these cookies, certain functionality may
                become unavailable.
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Preference cookies: To remember information that changes the
                  way the Platform behaves or looks, such as your preferred
                  language
                </li>
                <li>
                  Personalization cookies: To help us recognize you when you
                  return to our Platform so that we can personalize our content
                  for you
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-6 mb-3">
                3.3 Analytics and Customization Cookies
              </h3>
              <p>
                These cookies collect information that is used either in
                aggregate form to help us understand how our Platform is being
                used or how effective our marketing campaigns are, or to help us
                customize our Platform for you.
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Analytics cookies: To help us understand how visitors interact
                  with our Platform by collecting and reporting information
                  anonymously
                </li>
                <li>
                  Usage pattern cookies: To track how you use our Platform so we
                  can improve its functionality
                </li>
              </ul>
              <h3 className="text-lg font-medium mt-6 mb-3">
                3.4 Advertising Cookies
              </h3>
              <p>
                These cookies are used to make advertising messages more
                relevant to you. They perform functions like preventing the same
                ad from continuously reappearing, ensuring that ads are properly
                displayed, and in some cases selecting advertisements that are
                based on your interests.
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Targeted advertising cookies: To deliver ads that may be
                  relevant to you and your interests
                </li>
                <li>
                  Social media cookies: To enable you to share pages and content
                  that you find interesting on our Platform through third-party
                  social networking and other websites
                </li>
              </ul>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                4. What About Other Tracking Technologies?
              </h2>
              <p>
                Cookies are not the only way to recognize or track visitors to a
                website. We may use other, similar technologies from time to
                time, like web beacons (sometimes called "tracking pixels" or
                "clear gifs"). These are tiny graphics files that contain a
                unique identifier that enable us to recognize when someone has
                visited our Platform. This allows us, for example, to monitor
                the traffic patterns of users from one page within our Platform
                to another, to deliver or communicate with cookies, to
                understand whether you have come to our Platform from an online
                advertisement displayed on a third-party website, to improve
                site performance, and to measure the success of email marketing
                campaigns. In many instances, these technologies are reliant on
                cookies to function properly, and so declining cookies will
                impair their functioning.
              </p>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                5. How Can You Control Cookies?
              </h2>
              <p>
                You have the right to decide whether to accept or reject
                cookies. You can exercise your cookie preferences by clicking on
                the appropriate opt-out links provided below.
              </p>
              <h3 className="text-lg font-medium mt-6 mb-3">
                5.1 Browser Controls
              </h3>
              <p>
                Most web browsers allow you to manage your cookie preferences.
                You can set your browser to refuse cookies or delete certain
                cookies. Generally, you should also be able to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  See what cookies you've got and delete them individually
                </li>
                <li>Block third-party cookies</li>
                <li>Block cookies from particular sites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p>
                Please note that if you choose to block all cookies, this may
                severely impact the functionality of our Platform.
              </p>
              <h3 className="text-lg font-medium mt-6 mb-3">
                5.2 Mobile Device Controls
              </h3>
              <p>
                Most mobile devices allow you to manage cookies through the
                settings feature. Please refer to the instructions provided by
                your mobile device manufacturer.
              </p>
              <h3 className="text-lg font-medium mt-6 mb-3">
                5.3 Third-Party Opt-Out Tools
              </h3>
              <p>
                You can opt out of interest-based targeting provided by
                participating ad servers through:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  The Digital Advertising Alliance (DAA) in the US:{" "}
                  <a
                    href="http://optout.aboutads.info/"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    http://optout.aboutads.info/
                  </a>
                </li>
                <li>
                  The Digital Advertising Alliance of Canada (DAAC) in Canada:{" "}
                  <a
                    href="http://youradchoices.ca/choices"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    http://youradchoices.ca/choices
                  </a>
                </li>
                <li>
                  The European Interactive Digital Advertising Alliance (EDAA)
                  in Europe:{" "}
                  <a
                    href="http://www.youronlinechoices.com/"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    http://www.youronlinechoices.com/
                  </a>
                </li>
              </ul>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                6. How Often Will We Update This Cookie Policy?
              </h2>
              <p>
                We may update this Cookie Policy from time to time in order to
                reflect, for example, changes to the cookies we use or for other
                operational, legal, or regulatory reasons. Please therefore
                revisit this Cookie Policy regularly to stay informed about our
                use of cookies and related technologies.
              </p>
              <p>
                The date at the top of this Cookie Policy indicates when it was
                last updated.
              </p>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                7. Where Can You Get Further Information?
              </h2>
              <p>
                If you have any questions about our use of cookies or other
                technologies, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@srimatch.com
                <br />
                <strong>Postal Address:</strong> 42 Galle Road, Colombo 03, Sri
                Lanka
                <br />
                <strong>Phone:</strong> +94 11 234 5678
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                By continuing to use our Platform, you are agreeing to our use
                of cookies as described in this Cookie Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;
