type NavItem = {
  id: number;
  label: string;
  icon: string;
  to: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  status: string;
};

type ApiUser = {
  id: number;
  firebaseUID: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  status: string;
  phone: string;
  wing: string;
  flatNumber: number;
  createdAt: string;
  updatedAt: string;
};

type SelectOption = {
  name: string;
  code: SelectCode;
};

type FamilyMember = {
  id: number;
  residentId: number;
  name: string;
  gender: string;
  relation: string;
  photoUrl: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
};

type Vehicle = {
  id: number;
  residentId: null;
  vehicleNumber: string;
  type: string;
  model: string;
  parkingSlot: number | undefined | null;
  stickerIssued: boolean;
}