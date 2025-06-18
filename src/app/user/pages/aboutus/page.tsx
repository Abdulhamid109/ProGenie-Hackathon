import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-100">      
        
      {/* Main Content */}
      <main className="flex-1 p-6 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              About littejob
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              At littejob, we’re passionate about connecting talent with opportunity. Our mission is to empower job seekers and employers to build meaningful careers and thriving workplaces.
            </p>
          </section>

          {/* Mission Section */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Our Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Empowering Job Seekers
                </h3>
                <p className="text-gray-600">
                  We provide tools, resources, and personalized job recommendations to help you find the perfect role, whether you’re starting your career or making a bold switch.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Supporting Employers
                </h3>
                <p className="text-gray-600">
                  We streamline hiring with advanced matching algorithms and a diverse talent pool, helping companies find the right fit faster.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-12 bg-gray-50 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Integrity
                </h3>
                <p className="text-gray-600">
                  We operate with transparency and fairness, ensuring trust in every interaction.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  We embrace technology to create smarter, more efficient ways to connect talent and opportunity.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Inclusion
                </h3>
                <p className="text-gray-600">
                  We champion diversity, ensuring everyone has access to opportunities that matter.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
              Our dedicated team is committed to making littejob the best platform for your career journey.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800">Jane Doe</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800">John Smith</h3>
                <p className="text-gray-600">Head of Technology</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800">Emily Johnson</h3>
                <p className="text-gray-600">Head of Talent</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-12 text-center bg-emerald-600 text-white rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Whether you’re looking for your next role or the perfect hire, littejob is here to help. Start your journey today!
            </p>
            <Link
              href="/jobs"
              className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Explore Jobs
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white p-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} littejob. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href="#" className="text-sm hover:text-emerald-400">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:text-emerald-400">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:text-emerald-400">
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}