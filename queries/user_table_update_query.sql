-- Added the functionality of deleted or not 

ALTER TABLE users
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'activated',
ADD CONSTRAINT status_check CHECK (status IN ('activated', 'deleted'));
