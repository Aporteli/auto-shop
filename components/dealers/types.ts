export type DealerCardData = {
  id: number;
  companyName: string;
  companyNameRu: string | null;
  logo: string | null;
  address: string | null;
  addressRu: string | null;
  phone: string | null;
  email: string;
  website: string | null;
  listingsCount: number;
};

export type DealersResponse = {
  dealers: DealerCardData[];
  total: number;
};
