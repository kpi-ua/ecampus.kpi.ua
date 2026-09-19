export interface FacultyData {
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  titleName?: string;
}

export interface StudentCertificateData {
  faculty?: FacultyData;
  decanatPhone?: string;
  fullName?: string;
  studentShortName?: string;
  sex?: string;
  course?: number;
  educationLevel?: string;
  group?: string;
  facultyRv?: string;
  educationForm?: string;
  financingSource?: string;
  graduateDay?: string;
  graduateMonth?: string;
  graduateYear?: string;
  orderName?: string;
  orderDay?: string;
  orderMonth?: string;
  orderYear?: string;
}
