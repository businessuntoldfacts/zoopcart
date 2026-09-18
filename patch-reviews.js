const fs = require('fs');
let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

const oldHeader = `<div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0F172A]">Real Stories & Reviews</h2>
          <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
            Write a Review
          </Button>
        </div>`;

const newHeader = `<div className="flex flex-col items-center justify-center text-center mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">Real Stories & Reviews</h2>
          <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
            Write a Review
          </Button>
        </div>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
