import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  trackId: number;

  @Column({ nullable: true })
  trackName: string;

  @Column({ nullable: true })
  artistName: string;

  @Column({ nullable: true })
  collectionName: string;

  @Column({ nullable: true })
  artworkUrl100: string;

  @Column({ nullable: true })
  artworkUrl600: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  releaseDate: string;

  @Column({ nullable: true })
  primaryGenreName: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  trackViewUrl: string;

  @Column({ nullable: true })
  collectionViewUrl: string;

  @Column({ nullable: true })
  artistViewUrl: string;

  @Column({ nullable: true })
  previewUrl: string;

  @Column({ type: 'float', nullable: true })
  trackPrice: number;

  @Column({ type: 'float', nullable: true })
  collectionPrice: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  contentAdvisoryRating: string;

  @Column({ nullable: true })
  isExplicit: boolean;

  @Column()
  searchTerm: string;

  @Column({ default: 'episode' })
  kind: string;

  @Column({ default: 'track' })
  wrapperType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Episode-specific fields

  @Column({ nullable: true })
  episodeUrl: string;

  @Column({ nullable: true })
  episodeContentType: string;

  @Column({ nullable: true })
  episodeFileExtension: string;

  @Column({ nullable: true })
  episodeGuid: string;

  @Column({ type: 'int', nullable: true })
  episodeLength: number;

  @Column({ type: 'int', nullable: true })
  episodeNumber: number;

  @Column({ type: 'int', nullable: true })
  seasonNumber: number;

  @Column({ type: 'bigint', nullable: true })
  collectionId: number;

  @Column({ nullable: true })
  collectionCensoredName: string;

  @Column({ nullable: true })
  trackCensoredName: string;

  @Column({ nullable: true })
  artworkUrl30: string;

  @Column({ nullable: true })
  artworkUrl60: string;

  @Column({ type: 'float', nullable: true })
  collectionHdPrice: number;

  @Column({ nullable: true })
  collectionExplicitness: string;

  @Column({ nullable: true })
  trackExplicitness: string;

  @Column({ type: 'int', nullable: true })
  trackTimeMillis: number;

  @Column('simple-array', { nullable: true })
  genreIds: string[];

  @Column('simple-array', { nullable: true })
  genres: string[];
}
