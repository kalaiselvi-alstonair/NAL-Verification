import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Common male and female names for gender detection
const maleNames = [
  'john', 'michael', 'david', 'james', 'robert', 'william', 'richard', 'joseph', 'thomas', 'christopher',
  'charles', 'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua',
  'kenneth', 'kevin', 'brian', 'george', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan',
  'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon',
  'benjamin', 'frank', 'gregory', 'raymond', 'samuel', 'patrick', 'alexander', 'jack', 'dennis', 'jerry',
  'tyler', 'aaron', 'jose', 'adam', 'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle', 'walter',
  'ethan', 'jeremy', 'harold', 'seth', 'christian', 'mason', 'austin', 'juan', 'keith', 'roger',
  'noah', 'gavin', 'carl', 'ross', 'morgan', 'malcolm', 'barry', 'leonard', 'stuart', 'timothy',
  'raj', 'amit', 'suresh', 'kumar', 'vijay', 'anand', 'prashant', 'rahul', 'sanjay', 'deepak',
  'manish', 'nitin', 'prakash', 'ashok', 'sunil', 'ramesh', 'mahesh', 'dinesh', 'sachin', 'rohit',
  'arun', 'rajesh', 'vinod', 'suresh', 'ramesh', 'mahesh', 'dinesh', 'sachin', 'rohit', 'virat',
  'yuvraj', 'hardik', 'kl', 'jasprit', 'ravindra', 'ravichandran', 'ishant', 'umesh', 'bhuvneshwar',
  'shikhar', 'rohit', 'virat', 'ajinkya', 'cheteshwar', 'ravindra', 'hardik', 'kl', 'rishabh',
  'shubman', 'ishan', 'suryakumar', 'venkatesh', 'shardul', 'mohammed', 'jasprit', 'yuzvendra'
];

const femaleNames = [
  'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen',
  'nancy', 'lisa', 'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth', 'sharon', 'michelle',
  'laura', 'emily', 'kimberly', 'deborah', 'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen',
  'sandra', 'donna', 'carol', 'ruth', 'sharon', 'michelle', 'laura', 'emily', 'kimberly', 'deborah',
  'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth',
  'sharon', 'michelle', 'laura', 'emily', 'kimberly', 'deborah', 'dorothy', 'lisa', 'nancy', 'karen',
  'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth', 'sharon', 'michelle', 'laura', 'emily',
  'kimberly', 'deborah', 'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen', 'sandra', 'donna',
  'priya', 'neha', 'anjali', 'kavita', 'sunita', 'meera', 'radha', 'laxmi', 'geeta', 'sita',
  'rekha', 'usha', 'mala', 'kala', 'nila', 'puja', 'ritu', 'mona', 'sona', 'tina',
  'aishwarya', 'deepika', 'priyanka', 'katrina', 'alia', 'kareena', 'karisma', 'madhavi', 'rekha',
  'sridevi', 'waheeda', 'zeenat', 'dimple', 'jaya', 'shabana', 'smita', 'sharmila', 'mumtaz',
  'nargis', 'meena', 'vijayanthimala', 'hema', 'rekha', 'sridevi', 'madhavi', 'jaya', 'shabana',
  'smita', 'sharmila', 'mumtaz', 'nargis', 'meena', 'vijayanthimala', 'hema', 'rekha', 'sridevi'
];

// Function to determine gender based on name
export function getGenderFromName(name: string): 'male' | 'female' | 'unknown' {
  if (!name) return 'unknown';
  
  const cleanName = name.toLowerCase().trim();
  
  // Check if it's a male name
  if (maleNames.includes(cleanName)) {
    return 'male';
  }
  
  // Check if it's a female name
  if (femaleNames.includes(cleanName)) {
    return 'female';
  }
  
  // Check for common suffixes/patterns
  if (cleanName.endsWith('a') || cleanName.endsWith('i') || cleanName.endsWith('ee')) {
    return 'female';
  }
  
  if (cleanName.endsWith('n') || cleanName.endsWith('r') || cleanName.endsWith('t')) {
    return 'male';
  }
  
  return 'unknown';
}

// Function to get appropriate avatar URL based on gender
export function getAvatarUrl(name: string): string {
  const gender = getGenderFromName(name);
  
  if (gender === 'female') {
    // Use a more feminine avatar style with longer hair and feminine features
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&hair=long01&hairColor=black&accessories=round&accessoriesColor=black&clothingColor=pink&eyes=happy&eyebrow=default&mouth=smile&skinColor=light&clothing=shirtVNeck`;
  } else if (gender === 'male') {
    // Use a more masculine avatar style with shorter hair and masculine features
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&hair=short&hairColor=brown&accessories=round&accessoriesColor=black&clothingColor=blue&eyes=happy&eyebrow=default&mouth=smile&skinColor=light&clothing=shirtVNeck`;
  } else {
    // Default avatar for unknown gender
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  }
}
