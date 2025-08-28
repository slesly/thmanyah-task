import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('podcasts')
export class Podcast {
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

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  releaseDate: string;

  @Column({ type: 'int', nullable: true })
  trackCount: number;

  @Column({ nullable: true })
  primaryGenreName: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  feedUrl: string;

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

  @Column({ nullable: true })
  searchTerm: string;

  @Column({ default: 'podcast' })
  kind: string;

  @Column({ default: 'track' })
  wrapperType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 