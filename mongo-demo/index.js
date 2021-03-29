const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then( () => console.log('Connected to MongoDB...'))
    .catch( err => console.error('Could not connect to MongoDB', err));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
 //     match: /pattern/ 
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        //uppercase: true
        trim:true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback) {
                setTimeout(() => {
                     // Do some async work
                     const result = v && v.length > 0;
                     callback(result);
                }, 100);
        
            },
            message: 'A course should at least 1 tag.' 
        }
    },
    date: { type:Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

// Classes, objects
// Course, nodeCourse

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular.js Course',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price:15.8
    });
    try {
        const result = await course.save();
        console.log(result);
    } catch(err) {
        for(field in err.errors)
            console.log(err.errors[field].message);
    }
    

}

//createCourse();

async function updateCourse( id ) {
    // Query first
    // find by id
    // modify
    // save
    const course = await Course.findByIdAndUpdate( id ,{
        $set: {
            author: "Dindu",
            isPublished: false
        }
    }, { old: true });

 
    console.log(course);
}


async function removeCourse( id ) {
    // Query first
    // find by id
    // modify
    // save
   // const result = await Course.deleteMany( { _id: id} ) 
    const course = await Course.findByIdAndRemove( id );

 
    console.log(course);

}



async function getCourses() {
   // eq (equal
   // ne (not equal)
   // gt (greater than)
   // gte ( greater than or equal to)
   // lt (less than)
   // lte (less than or equal to)
   // in
   // nin (not in)
    // /api/courses?pageNumber=2&pageSize=10

  
    
   const courses = await Course
     .find({ _id: '60513fbc21bb8b3110ec25c0'  })
  //   .skip((pageNumbeer - 1) * pageSize )
   //  .find({ price: { $gte: 10, $lte: 20 } })
   // .find({ price: { $in: [10, 15, 20 ] }})
  //  .or([ {author: 'Mosh'}, {isPublished:true} ])
 //    .and( [ ] )
 // starts with Mosh
   //  .find({ author: /^Mosh/ })
     // ends with Hamedani
 //    .find({ author: /Hamedani$/i })
     // Contains Mosh
  //  .find({ author: })
  //   .limit( pageSize )
     .sort({ name: 1 })
     .select({ name: 1, tags: 1, price: 1});
   console.log(courses[0].price);
}

getCourses();
 