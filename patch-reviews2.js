const fs = require('fs');
let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

const regex = /<div className="flex justify-between items-center mb-8">[\s\S]*?<\/div>/;

const newHeader = `<div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] w-full text-center">Real Stories & Reviews</h2>
          <div className="w-full flex justify-center mt-2">
            <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
              Write a Review
            </Button>
          </div>
        </div>`;

code = code.replace(regex, newHeader);
fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
console.log("Replaced!");
